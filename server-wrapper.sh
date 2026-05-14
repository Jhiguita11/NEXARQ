#!/bin/bash
cd /home/z/my-project
while true; do
    echo "$(date) Starting server..." >> server-wrapper.log
    rm -rf .next/cache 2>/dev/null
    bun run dev >> dev.log 2>&1
    EXIT_CODE=$?
    echo "$(date) Server exited with code $EXIT_CODE" >> server-wrapper.log
    sleep 2
done
