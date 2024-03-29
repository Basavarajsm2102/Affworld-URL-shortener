import React, { ReactNode } from 'react';

import {
    Box,
    Burger,
    Container,
    createStyles,
    Group,
    Header,
    Paper,
    Stack,
    Text,
    Transition,
  } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLink } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';

import ActionAvatar from 'src/components/NavBar/ActionAvatar';
import { routes as routesConfig } from 'src/config/routes_config';



const HEADER_HEIGHT = 60;

type NavLink = {
  link?: string;
  label?: string;
  component?: React.ComponentType<any>;
  action?: () => Promise<void>;
};

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

const NavBar = () => {
  const [opened, toggleOpened] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const auth = useAuth();

  const authenticatedLinks = [
    {
      link: routesConfig.home.path_string(),
      label: 'Home',
      id: 'home'
    },
    {
      component: <ActionAvatar />,
      id: 'action'
    },
  ];


  const unauthenticatedLinks = [
    {
      link: routesConfig.home.path_string(),
      label: 'Home',
      component: null,
      id: 'home'
    },
    {
      link: routesConfig.signIn.path_string(),
      label: 'Sign in',
      component: null,
      id: 'signIn'
    },
    {
      link: routesConfig.signUp.path_string(),
      label: 'Sign up',
      component: null,
      id: 'signUp'
    }];


  const items = (
  
      (auth ? authenticatedLinks : unauthenticatedLinks)?.map((link) => {
        if (link?.component) {
          return (
            <Box pl={5} py={15} key={link.id}>
              {link.component}
            </Box>
          );
        }
        return (
          <NavLink
            key={link.label}
            to={link.link ?? ''}
            onClick={() => toggleOpened.toggle()}
            className={cx(classes.link, {
              [classes.linkActive]: window.location.pathname === link.link,
            })}
          >
            {link.label}
          </NavLink>
        );
      })
  );
  
  return (
    <Header height={HEADER_HEIGHT} mb={40} className={classes.root}>
      <Container className={classes.header}>
        <NavLink to="/">
          <Group>
            <Text weight={600}>MERN App</Text>
          </Group>
        </NavLink>
        <Group spacing={5} className={classes.links}>
          <Group>{items}</Group>
        </Group>
        <Burger
          opened={opened}
          onClick={() => toggleOpened.toggle()}
          className={classes.burger}
          size="sm"
        />
        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder={true} style={styles}>
              <Stack spacing={0}> {items}</Stack>
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
};

export default NavBar;
