#!/bin/bash

HOST=ccshrek.duckdns.org
DOOR_PORT=1357
REG_PORT=5001

echo Content-Type: text/html
echo

cat <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <title>CCoWMU Office</title>
  <style>
  body {
    font-size: xx-large;
  }
  .content {
    max-width: 500px;
    margin: auto;
  }
  .item {
    text-align: center;
    margin-top: 1em;
    margin-bottom: 1em;
  }
  #door {
    padding: 1em;
    border-radius: 3px;
  }
  .open {
    color: #fff;
    background-color: #5cb85c;
    border-color: #5cb85c;
  }
  .closed {
    color: #fff;
    background-color: #d9534f;
    border-color: #d9534f;
  }
  input {
    font-size: xx-large;
    height: 2em;
    width: 100%;
    box-sizing: border-box;
  }
  input[type="submit"] {
    font-size: xx-large;
    height: 2em;
    width: 100%;
  }
  #reg form {
    font-size: 0;
  }
  </style>
</head>
<body>
<div class="content">
EOF

if [ "$REQUEST_METHOD" = GET ]; then
  door_raw=$(echo -e "door status\r" | nc -w 2 $HOST $DOOR_PORT)
  door=$(echo "$door_raw" | sed 's/The office door has been \(\S\+\) since .*/\1/')
  time=$(echo "$door_raw" | sed 's/The office door has been \S\+ since \(.*\)/\1/')

  cat <<EOF
<div id="users" class="item">
EOF
  curl -m 2 -s "http://$HOST:$REG_PORT/plain"
  cat <<EOF
</div>

<div id="door" class="item $door">
EOF
  echo $door
  cat <<EOF
</div>

<div id="time" class="item">
EOF
  echo As of $time
  cat <<EOF
</div>

<div id="phone" class="item">
  Phone: <a href="tel:1-616-504-1337">(616) 504-1337</a>
</div>

<hr>

<div id="reg" class="item">
  <form method="POST">
    <input type="text" name="nick" placeholder="nick">
    <input type="text" name="mac" placeholder="mac">
    <input type="submit" name="action" value="reg">
    <input type="submit" name="action" value="dereg">
  </form>
</div>

EOF
else # POST
  form=$(cat)

  # identify and sanitize input; we are not very strict here,
  # and will allow valid prefixes of otherwise invalid input.
  action=$(echo $form | \
    sed -En 's/^.*action=(reg|dereg).*$/\1/p')
  nick=$(echo $form | \
    sed -En 's/^.*nick=([A-Za-z0-9]*).*$/\1/p')
  mac=$(echo $form | \
    tr '[:upper:]-' '[:lower:]:' | \
    sed -E 's/%3a/:/g' | \
    sed -En 's/^.*mac=(([a-f0-9]{2}:){5}[a-f0-9]{2}).*$/\1/p')

  if [ "$action" = reg -o "$action" = dereg ]
  then
    echo "<p>attempting to $action $mac for $nick</p>"
    curl -s -m 2 -d "nick=$nick&mac=$mac" "http://$HOST:$REG_PORT/$action"
  else
    echo "invalid request"
  fi

  cat <<EOF
<div id="return" class="item">
  <input type="button" value="return" onClick="window.location.href=window.location.href">
</div>
EOF
fi

cat <<EOF
</div>
</body>
</html>
EOF
