import asyncio
import websockets
import json
from capture import HeadDetector

HOLD_DURATION = 3.0


async def head_server(websocket) -> None:
    detector = HeadDetector()
    current_direction = 0
    timer_start = None

    try:
        while True:
            direction = detector.get_direction()
            direction_text = ["CENTER", "LEFT", "RIGHT"][direction]
            print(direction_text)

            if direction != 0 and direction != current_direction:
                current_direction = direction
                timer_start = asyncio.get_event_loop().time()

            elif direction == 0 and current_direction != 0:
                current_direction = 0
                timer_start = None

            if timer_start:
                elapsed = asyncio.get_event_loop().time() - timer_start
                if elapsed >= HOLD_DURATION:
                    await websocket.send(json.dumps({"selection": direction_text}))
                    timer_start = None
                    current_direction = 0

            await asyncio.sleep(0.05)

    finally:
        detector.close()


async def main():
    start_server = websockets.serve(
        head_server, "0.0.0.0", 8765)
    await start_server
    print("WebSocket server started on ws://0.0.0.0:8765")
    await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
