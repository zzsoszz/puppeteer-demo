ps -aux|grep chrome|grep -v grep | awk '{print $2}' | xargs kill -9

