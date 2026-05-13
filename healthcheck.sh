#!/bin/bash
cd /home/z/my-project
HTTP=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://localhost:3000 2>/dev/null)
if [ "$HTTP" != "200" ]; then
    echo "$(date) FIX: Server down, restarting..." >> healthcheck.log
    pkill -9 -f "next" 2>/dev/null
    pkill -9 -f "turbo" 2>/dev/null  
    pkill -9 -f "bun" 2>/dev/null
    sleep 1
    rm -rf .next/cache 2>/dev/null
    nohup bun run dev >> dev.log 2>&1 &
    echo "$(date) FIX: Started bun, waiting..." >> healthcheck.log
    sleep 8
    NEW=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000 2>/dev/null)
    echo "$(date) FIX: Result HTTP $NEW" >> healthcheck.log
fi
