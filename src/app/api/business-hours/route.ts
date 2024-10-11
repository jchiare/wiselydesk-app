import { NextResponse } from 'next/server';
import { parseISO, isWithinInterval, set, getDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const botId = searchParams.get('botId');
  const key = searchParams.get('key');

  if (!botId || !key) {
    return NextResponse.json({ error: 'Bot ID and key are required' }, { status: 400 });
  }

  try {
    const botSetting = await prisma.botSetting.findUnique({
      where: {
        bot_id_key: {
          bot_id: parseInt(botId),
          key: key,
        },
      },
    });

    if (!botSetting) {
      return NextResponse.json({ error: 'Bot setting not found' }, { status: 404 });
    }

    const isOnline = await checkBotOnlineStatus(botSetting);

    return NextResponse.json({ isOnline });
  } catch (error) {
    console.error('Error checking bot status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function checkBotOnlineStatus(botSetting: any) {
  const now = new Date();
  const zonedNow = toZonedTime(now, botSetting.time_zone);

  if (botSetting.is_active === 'always') {
    return true;
  }

  if (botSetting.is_active === 'never') {
    return false;
  }

  if (botSetting.is_active === 'widget_hours') {
    // Check if current day is in the active days
    const currentDay = getDay(zonedNow) + 1; // getDay returns 0-6, we need 1-7
    const activeDays = botSetting.days_on.split(',').map(Number);
    if (!activeDays.includes(currentDay)) {
      return false;
    }

    // Check if current time is within widget hours
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

  // Check if is_active_expires is set and not expired
  if (botSetting.is_active_expires) {
    const expiryDate = parseISO(botSetting.is_active_expires);
    return now < expiryDate;
  }

  return false;
}

