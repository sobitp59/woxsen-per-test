import Link from "next/link";
import { Heading, Text, Highlight, Flex, Button } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";

import MainLayout from "../components/layouts/main-layout";

export default function HomePage() {
  return (
    <>
      <MainLayout>
        <Flex
          w={{
            base: "full",
            lg: "50%",
          }}
          alignSelf="center"
          px={4}
          gap={8}
          minH="full"
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Heading
            as="h1"
            lineHeight="tall"
            textAlign="center"
          >
            <Highlight
              query="Behavioural Assessment"
              styles={{
                py: 1,
                px: 4,
                rounded: "full",
                bg: "red.500",
                color: "white",
              }}
            >
              Behavioural Assessment
            </Highlight>
          </Heading>
          <Link href="/test">
            <Button
              w="min-content"
              colorScheme="red"
              variant="outline"
              rightIcon={<FiArrowRight size={20} />}
            >
              Take Test
            </Button>
          </Link>
        </Flex>
      </MainLayout>
    </>
  );
}
