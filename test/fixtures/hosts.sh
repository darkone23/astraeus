#!/bin/bash

# uses the example inventory provided at http://docs.ansible.com/developing_inventory.html

if [ "$1" == "--list" ]; then
    cat $(dirname $0)/hosts.json
else
    echo '{}'
fi
