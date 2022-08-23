import React, { useState, useEffect } from 'react';
import { Alert, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';

import { Search } from '@components/Search';
import { ProductCard, ProductProps } from '@components/ProductCard';

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
    const [pizzas, setPizzas] = useState<ProductProps[]>([]);
    const [search, setSearch] = useState('');

    const { COLORS } = useTheme();

    async function fetchPizzas(value: string) {
        const formattedValue = value.toLocaleLowerCase().trim();

        firestore()
            .collection('pizzas')
            .orderBy('name_insensitive')
            .startAt(formattedValue)
            .endAt(`${formattedValue}\uf8ff`)
            .get()
            .then((response) => {
                const data = response.docs.map((doc) => {
                    return {
                        id: doc.id,
                        ...doc.data(),
                    };
                }) as ProductProps[];

                setPizzas(data);
            })
            .catch(() => Alert.alert('Consulta', 'Não foi possível realizar a consulta.'));
    }

    async function handleSearch() {
        fetchPizzas(search);
    }

    async function handleSearchClear() {
        setSearch('');

        fetchPizzas(search);
    }

    useEffect(() => {
        fetchPizzas('');
    }, []);

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

            <Search
                onChangeText={setSearch}
                value={search}
                onSearch={handleSearch}
                onClear={handleSearchClear}
            />

            <MenuHeader>
                <Title>Cardápio</Title>

                <MenuHeaderNumber>10 pizzas</MenuHeaderNumber>
            </MenuHeader>

            <FlatList
                data={pizzas}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <ProductCard data={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 20,
                    paddingBottom: 125,
                    marginHorizontal: 24,
                }}
            />
        </Container>
    );
}