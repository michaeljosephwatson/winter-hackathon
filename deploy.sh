#!/bin/bash

set -a
source .env
set +a

WEBSOCKET_PORT="8765"
CLIENT_PORT="8000"
KEY_FILE="./key.pem"


echo "Copying client and cam_accessibility folders to EC2..."
scp -i $KEY_FILE -r ./client ec2-user@$EC2_IP:/home/ec2-user/
scp -i $KEY_FILE -r ./cam_accessibility ec2-user@$EC2_IP:/home/ec2-user/

echo "Connecting to EC2 to run applications..."
ssh -i "$KEY_FILE" "ec2-user@$EC2_IP" << EOF
    # Kill any existing processes on the ports
    pkill -f "websocket.py"
    pkill -f "http.server"

    # Install dependencies
    if [ -f "cam_accessibility/requirements.txt" ]; then
        pip install -r cam_accessibility/requirements.txt
    fi

    # Run websocket
    nohup python3 cam_accessibility/websocket.py --port "$WEBSOCKET_PORT" > websocket.log 2>&1 &
    echo "Websocket server started on port $WEBSOCKET_PORT"

    # Run client
    nohup python3 -m http.server --directory client "$CLIENT_PORT" > client.log 2>&1 &
    echo "Client server started on port $CLIENT_PORT"
EOF

echo "Deployment complete."
echo "Client should be accessible at http://$EC2_IP:$CLIENT_PORT"
echo "Websocket is running on port $WEBSOCKET_PORT"
