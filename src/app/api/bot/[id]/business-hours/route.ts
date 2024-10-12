import { NextResponse } from 'next/server';
import { parseISO, isWithinInterval, set, getDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import prisma from "@/lib/prisma";
import type { BotSetting } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request,  { params }: {params: { id: string }}) {
  const { id: botId } = params;

  if (!botId) {
    return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 });
  }

  try {
    const botSetting = await prisma.botSetting.findUnique({
      where: {
        bot_id: parseInt(botId),
      },
    });

    if (!botSetting) {
      return NextResponse.json({ error: 'Bot setting not found' }, { status: 404 });
    }

    const isOnline = await checkBotOnlineStatus(botSetting);

    // Return full bot settings with online status
    return NextResponse.json({ ...botSetting, isOnline });
  } catch (error) {
    console.error('Error checking bot status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add PUT method to update bot settings
export async function PUT(request: Request) {
  try {
    const { botId, ...updatedSettings } = await request.json();

    if (!botId) {
      return NextResponse.json({ error: 'Bot ID is required' }, { status: 400 });
    }

    const existingBotSetting = await prisma.botSetting.findUnique({
      where: {
        bot_id: parseInt(botId),
      },
    });

    if (!existingBotSetting) {
      return NextResponse.json({ error: 'Bot setting not found' }, { status: 404 });
    }

    const updatedBotSetting = await prisma.botSetting.update({
      where: { bot_id: parseInt(botId) },
      data: updatedSettings, // update with data from the form
    });

    return NextResponse.json(updatedBotSetting);
  } catch (error) {
    console.error('Error updating bot settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Check bot online status (no changes from original)
async function checkBotOnlineStatus(botSetting: BotSetting) {
  const now = new Date();
  const zonedNow = toZonedTime(now, botSetting.time_zone);

  if (botSetting.is_active === 'always') {
    return true;
  }

  if (botSetting.is_active === 'never') {
    return false;
  }

  if (botSetting.is_active === 'widget_hours') {
    const currentDay = getDay(zonedNow) + 1; // getDay returns 0-6, we need 1-7
    const activeDays = botSetting.days_on.split(',').map(Number);
    if (!activeDays.includes(currentDay)) {
      return false;
    }

    const startTime = set(zonedNow, {
      hours: botSetting.widget_start_hour,
      minutes: botSetting.widget_start_minute,
      seconds: 0,
      milliseconds: 0,
    });

    const endTime = set(zonedNow, {
      hours: botSetting.widget_end_hour,
      minutes: botSetting.widget_end_minute,
      seconds: 0,
      milliseconds: 0,
    });

    return isWithinInterval(zonedNow, { start: startTime, end: endTime });
  }

  if (botSetting.is_active_expires) {
    const expiryDate = parseISO(botSetting.is_active_expires.toString());
    return now < expiryDate;
  }

  return false;
}
