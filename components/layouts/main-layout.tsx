import Head from "next/head";
import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

import Nav from "../common/nav";


interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout(props: MainLayoutProps) {
  return (
    <>
      <Head>
        <title>Woxsen University's Personality Test</title>
        <meta
          name="description"
          content="MBTI Personality Test"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      <Nav />
      <Flex
        as="main"
        w="100%"
        minH="calc(100vh - 80px)"
        justifyContent="center"
        alignItems="center"
      >
        {props.children}
      </Flex>
    </>
  );
}