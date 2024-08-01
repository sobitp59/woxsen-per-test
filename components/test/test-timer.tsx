import { useState, useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { FiClock } from "react-icons/fi";
import { Option } from "@swan-io/boxed";
import dayjs from "dayjs";

const SECOND_IN_MILLISECONDS = 1000;

interface TestTimerProps {
  running: boolean;
  onEnd?: (elapsedTime: dayjs.Dayjs) => void;
}

export default function TestTimer({ running, onEnd }: TestTimerProps) {
  const [elapsedTime, setElapsedTime] = useState<Option<dayjs.Dayjs>>(
    Option.None()
  );

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (running && elapsedTime.isNone()) {
      setElapsedTime(
        Option.Some(dayjs().minute(0).second(0).millisecond(0))
      );
    }

    if (running) {
      intervalId = setInterval(() => {
        setElapsedTime((elapsedTime) =>
          elapsedTime.map((time) => time.add(SECOND_IN_MILLISECONDS, "ms"))
        );
      }, SECOND_IN_MILLISECONDS);
    } else {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
      if (elapsedTime.isSome() && onEnd) {
        onEnd(elapsedTime.value);
      }
    }

    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [running, elapsedTime, onEnd]);

  return (
    <Flex
      width={100}
      px={2}
      columnGap={2}
      justifyContent="center"
      alignItems="center"
      borderColor="blackAlpha.300"
      rounded="md"
    >
      <FiClock size={20} />
      <Text fontWeight="bold">
        {elapsedTime.match({
          Some: (time) => {
            const minute = time.minute().toString().padStart(2, "0");
            const second = time.second().toString().padStart(2, "0");
            return `${minute} : ${second}`;
          },
          None: () => "-- : --",
        })}
      </Text>
    </Flex>
  );
}
