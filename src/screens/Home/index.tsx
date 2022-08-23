import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';

import { Search } from '@components/Search';

import {
    Container,
    Header,
    Greeting,
    GreetingEmoji,
    GreetingText,
    MenuHeader,
    MenuHeaderNumber,
    Title,
} from './styles';

import happyEmoji from '@assets/happy.png';

export function Home() {
    const { COLORS } = useTheme();

    return (
        <Container>
            <Header>
                <Greeting>
                    <GreetingEmoji source={happyEmoji} />

                    <GreetingText>Olá, Admin</GreetingText>
                </Greeting>

                <TouchableOpacity>
                    <MaterialIcons name='logout' size={24} color={COLORS.TITLE} />
                </TouchableOpacity>
            </Header>

            <Search onSearch={() => { }} onClear={() => { }} />

            <MenuHeader>
                <Title>Cardápio</Title>

                <MenuHeaderNumber>10 pizzas</MenuHeaderNumber>
            </MenuHeader>
        </Container>
    );
}