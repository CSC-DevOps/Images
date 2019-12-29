#!/bin/bash

function LVL0
{
    cd /srv/level0;
    echo "You enter level 0.";
    echo "You see a server.js file in your directory."
    echo
    echo "You try to run it with 'node server.js'"
    echo "Nothing happens."
} 


function check_lvl0
{
    nc -vz 127.0.0.1 8080 -w 4 
}

function LVL1
{
    if check_lvl0; then

    cd /srv/level1;
    echo "You enter level 1.";
    echo "You see a more fancy file in your directory."
    echo
    echo "You notice a package. But don't know what to do with it"

    else echo "A mysterious force prevents you from moving."; fi
} 

DONE_DONE_DONE=false;

exit_trap () {
  local lc="$BASH_COMMAND" rc=$?
  #echo "Command [$lc] exited with code [$rc]"

  if [[ $lc == *"curl"* ]] || [[ $lc == *"ASCEND"* ]]; then
    echo "You are on the right path!";
    if check_key; then
        DONE_DONE_DONE=true;
    fi
    return
  else
    if check_key; then
        rm -f 'golden_key';
        echo "The golden key crumbles to dust."; 
    fi
  fi

}

trap exit_trap DEBUG

check_key ()
{
    FILE="/srv/level1/golden_key"
    if [ -f "$FILE" ]; then
        return 0;
    fi
    return 1;
}

function ASCEND
{
    if check_key; then
        echo "Golden key found...";

        if $DONE_DONE_DONE; then

            echo;
            echo "The golden key unlocks the invisible stairs. You climb and see daylight.";
            sleep 2;
            echo "The dungeon begins to crumble...but you escape.";
            halt;
        fi
    else echo "You see a keyhole but have no key."; fi
    
}