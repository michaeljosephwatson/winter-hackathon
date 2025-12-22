import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from mediapipe.tasks.python.vision.face_landmarker import FaceLandmarker
import collections
import time


def capture_frame(cap: cv2.VideoCapture) -> mp.Image:
    """Capture a single frame from the webcam."""

    success, image = cap.read()
    if not success:
        return None
    return image


def process_landmarks(image: mp.Image, detector: FaceLandmarker) -> FaceLandmarker:
    """Process the image to detect facial landmarks and determine head direction."""

    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_image)
    detection_result = detector.detect(mp_image)

    if detection_result.face_landmarks:
        landmarks = detection_result.face_landmarks[0]
        return landmarks

    return None


def determine_direction(landmarks: FaceLandmarker) -> int:
    """Determine the head direction based on landmarks."""
    if not landmarks:
        return 0

    nose_x = landmarks[1].x
    left_face_x = landmarks[234].x
    right_face_x = landmarks[454].x

    face_center_x = (left_face_x + right_face_x) / 2
    deviation = nose_x - face_center_x

    left_threshold = 0.015
    right_threshold = -0.015

    if deviation > left_threshold:
        return 1  # Turn Left
    elif deviation < right_threshold:
        return 2  # Turn Right
    else:
        return 0  # Center


def smooth_direction(directions: list[int], window_size: int = 20) -> int:
    """Smooth out the direction over multiple frames."""

    if len(directions) < window_size:
        return 0

    counter = collections.Counter(directions[-window_size:])
    most_common = counter.most_common(1)

    if most_common:
        return most_common[0][0]

    return 0


class HeadDetector:
    """Class to detect head direction from webcam feed."""

    MODEL_PATH = 'face_landmarker.task'

    def __init__(self, window_size: int = 20):
        base_options = python.BaseOptions(model_asset_path=self.MODEL_PATH)
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.IMAGE,
            num_faces=1,
            min_face_detection_confidence=0.5,
            min_face_presence_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.detector = vision.FaceLandmarker.create_from_options(options)
        self.cap = cv2.VideoCapture(0)
        self.directions = []
        self.window_size = window_size

    def get_direction(self) -> int:
        """Get the current head direction."""

        frame = capture_frame(self.cap)
        if frame is None:
            return 0

        landmarks = process_landmarks(frame, self.detector)
        direction = determine_direction(landmarks)
        self.directions.append(direction)

        smoothed_direction = smooth_direction(
            self.directions, self.window_size)

        return smoothed_direction

    def close(self) -> None:
        """Closes all connections."""

        self.cap.release()
        self.detector.close()


def main():
    """Main method."""

    detector = HeadDetector()

    current_direction = 0
    timer_start = None
    HOLD_DURATION = 3.0
    selected_direction = None

    try:
        while True:
            frame = capture_frame(detector.cap)
            if frame is None:
                continue

            landmarks = process_landmarks(frame, detector.detector)
            direction = determine_direction(landmarks)
            detector.directions.append(direction)

            smoothed_direction = smooth_direction(detector.directions)
            direction_text = ["CENTER", "LEFT", "RIGHT"][smoothed_direction]

            if smoothed_direction != 0 and smoothed_direction != current_direction:
                current_direction = smoothed_direction
                timer_start = time.time()
                print(f"\nDirection: {direction_text} - Timer started!")

            elif smoothed_direction == 0 and current_direction != 0:
                print(f"Returned to CENTER - Timer reset!")
                current_direction = 0
                timer_start = None

            if timer_start is not None and smoothed_direction != 0:
                elapsed = time.time() - timer_start
                remaining = HOLD_DURATION - elapsed

                if elapsed >= HOLD_DURATION:
                    selected_direction = direction_text
                    print(f"\n✓ SELECTED: {selected_direction}!")
                    print(f"You chose to go {selected_direction}!\n")

                    timer_start = None
                    current_direction = 0
                    print("Pick another side or press 'q' to quit")

                else:
                    cv2.putText(frame, f"Hold for: {remaining:.1f}s", (10, 70),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 165, 255), 2)

            color = (0, 255, 0) if smoothed_direction == 0 else (0, 165, 255)
            cv2.putText(frame, f"Direction: {direction_text}", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

            cv2.imshow('Head Direction', frame)

    finally:
        detector.close()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
