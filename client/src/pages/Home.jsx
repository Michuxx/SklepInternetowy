import { useAuth } from "../app/store/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../app/api";
import styled from "styled-components";

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <Wrapper>
      {currentUser ? (
        <>
          <UserDetails />
          <GetUserById />
        </>
      ) : (
        <>
          <LoginForm />
          <RegisterForm />
        </>
      )}
    </Wrapper>
  );
};

export default Home;

const LoginForm = () => {
  const [data, setData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await api.post("/auth/login", data);
    } catch (err) {
      console.warn("Coś poszło nie tak podczas logowania");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Zaloguj się</Title>
      <Label>Adres email</Label>
      <TextInput
        type="email"
        required
        value={data.email}
        placeholder="np. majkelsonszymczakos2137@gmail.com"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <Label>Hasło</Label>
      <TextInput
        type="password"
        required
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />
      <Button type="submit">Dalej</Button>
    </Form>
  );
};

const RegisterForm = () => {
  const [data, setData] = useState({ name: "", email: "", password: "", passwordRepeat: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, passwordRepeat } = data;
    if (password != passwordRepeat) return;
    await api.post("/auth/register", data);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Stwórz konto</Title>
      <Label>Twoja nazwa</Label>
      <TextInput
        type="text"
        required
        value={data.name}
        placeholder="np. michalkelson69"
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />
      <Label>Adres email</Label>
      <TextInput
        type="email"
        required
        value={data.email}
        placeholder="np. majkelszymczakos7312@xd.xd"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <Label>Hasło</Label>
      <TextInput
        type="password"
        required
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />
      <Label>Powtórz hasło</Label>
      <TextInput
        type="password"
        required
        value={data.pa}
        onChange={(e) => setData({ ...data, passwordRepeat: e.target.value })}
      />
      <Button type="submit">Dalej</Button>
    </Form>
  );
};

const UserDetails = () => {
  const { currentUser, logout } = useAuth();

  return (
    <Form>
      <PrimaryText>{currentUser.name}</PrimaryText>
      <SecondaryText>{currentUser.email}</SecondaryText>
      <Button onClick={logout}>Wyloguj się</Button>
      <Link to="/tylko-dla-zalogowanych">Tylko dla zalogowanych</Link>
    </Form>
  );
};

const GetUserById = () => {
  const [someUserId, setSomeUserId] = useState("644179e541de4d678f6a65a2");
  const [someUser, setSomeUser] = useState(null);

  useEffect(() => {
    api
      .get(`/user/${someUserId}`)
      .then((res) => {
        if (res.data.user) setSomeUser(res.data.user);
      })
      .catch((err) => {
        setSomeUser(null);
        console.warn(`Nie ma użytkownika z id: ${someUserId}`);
      });
  }, [someUserId]);

  return (
    <Form>
      <Label>Wyszukaj użytkownika po jego id</Label>
      <TextInput
        type="text"
        value={someUserId}
        onChange={(e) => setSomeUserId(e.target.value)}
        placeholder="np. 644179e541de4d678f6a65a2"
      />
      {someUser && (
        <>
          <PrimaryText style={{ marginTop: "2rem" }}>{someUser.name}</PrimaryText>
          <SecondaryText>{someUser.email}</SecondaryText>
        </>
      )}
    </Form>
  );
};

const Wrapper = styled.main(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexWrap: "wrap",
  gap: "30px",
  justifyContent: "center",
  alignItems: "start",
  paddingTop: "8.5rem",
}));

const Form = styled.form(({ theme }) => ({
  backgroundColor: theme.secondary,
  width: "95%",
  maxWidth: "450px",
  border: `1px solid ${theme.gray["200"]}`,
  borderRadius: theme.rounded.md,
  padding: theme.padding.lg,
  display: "flex",
  flexDirection: "column",
}));

const Button = styled.button(({ theme }) => ({
  padding: theme.padding.md,
  backgroundColor: theme.main,
  color: theme.secondary,
  border: "none",
  borderRadius: theme.rounded.md,
  transitionDuration: "125ms",
  cursor: "pointer",
  marginTop: "1rem",
  display: "flex",
  justifyContent: "center",
  gap: ".75rem",
  ":hover": {
    scale: "97%",
  },
  ":active": {
    scale: "92%",
  },
}));

const PrimaryText = styled.h3(({ theme }) => ({
  fontSize: "1.5em",
  fontWeight: 500,
}));

const SecondaryText = styled.h3(({ theme }) => ({
  fontSize: ".95em",
  color: theme.gray["500"],
  fontWeight: 400,
}));

const Label = styled.label(({ theme }) => ({
  color: theme.gray["500"],
  fontSize: ".8em",
  textTransform: "uppercase",
  marginBottom: ".25rem",
  marginTop: "1rem",
}));

const TextInput = styled.input(({ theme }) => ({
  border: `1px solid ${theme.gray["200"]}`,
  borderRadius: theme.rounded.md,
  padding: theme.padding.md,
  outline: "none",
  transitionDuration: "100ms",
  ":focus": {
    borderColor: theme.main,
  },
}));

const Title = styled.h1(({ theme }) => ({
  fontSize: "2em",
  fontWeight: "bold",
  marginBottom: "2rem",
}));
