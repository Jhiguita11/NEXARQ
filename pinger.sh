#!/bin/bash
while true; do
    curl -s -o /dev/null --max-time 5 http://localhost:3000 > /dev/null 2>&1
    sleep 15
done
