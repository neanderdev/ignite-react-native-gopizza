import React, { useState, useCallback } from 'react';
import { Alert, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useAuth } from '@hooks/auth';

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
    NewProductButton,
} from './styles';

import happyEmoji from '@assets/happy.png';

export function Home() {
    const [pizzas, setPizzas] = useState<ProductProps[]>([]);
    const [search, setSearch] = useState('');

    const navigation = useNavigation();

    const { COLORS } = useTheme();

    const { user, signOut } = useAuth();

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

    async function handleOpen(id: string) {
        const route = user?.isAdmin ? 'product' : 'order';

        navigation.navigate(route, { id });
    }

    async function handleAdd() {
        navigation.navigate('product', {});
    }

    useFocusEffect(
        useCallback(() => {
            fetchPizzas('');
        }, [])
    );

    return (
        <Container>
            <Header>
                <Greeting>
                    <GreetingEmoji source={happyEmoji} />

                    <GreetingText>Olá, {user?.name}</GreetingText>
                </Greeting>

                <TouchableOpacity onPress={signOut}>
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

                <MenuHeaderNumber>{pizzas.length} {pizzas.length === 1 ? 'pizza' : 'pizzas'}</MenuHeaderNumber>
            </MenuHeader>

            <FlatList
                data={pizzas}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ProductCard
                        data={item}
                        onPress={() => handleOpen(item.id)}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 20,
                    paddingBottom: 125,
                    marginHorizontal: 24,
                }}
            />

            {
                user?.isAdmin && <NewProductButton
                    title='Cadastrar pizza'
                    type='secondary'
                    onPress={handleAdd}
                />
            }
        </Container>
    );
}