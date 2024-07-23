// pages/admin-login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { Flex, Button, Input, Text } from "@chakra-ui/react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (username === "woxsen123" && password === "woxsenuni123") {
      router.push("/admin-dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Flex
      w="full"
      h="full"
      justifyContent="center"
      alignItems="center"
      direction="column"
      p={5}
    >
      <Text fontSize="2xl" mb={4}>Admin Login</Text>
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        mb={3}
      />
      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        mb={3}
      />
      {error && <Text color="red.500" mb={3}>{error}</Text>}
      <Button onClick={handleLogin}>Login</Button>
    </Flex>
  );
}
