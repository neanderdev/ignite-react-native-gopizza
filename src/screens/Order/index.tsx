import React, { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import { ButtonBack } from '@components/ButtonBack';
import { RadioButton } from '@components/RadioButton';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ProductProps } from '@components/ProductCard';

import { OrderNavigationProps } from '@src/@types/navigation'

import { PIZZA_TYPES } from '@utils/pizzaTypes';

import {
    Container,
    ContentScroll,
    Header,
    Photo,
    Sizes,
    Form,
    Title,
    Label,
    FormRow,
    InputGroup,
    Price,
} from './styles';

type PizzaResponse = ProductProps & {
    prices_sizes: {
        [key: string]: number;
    };
};

export function Order() {
    const [size, setSize] = useState('');
    const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse);

    const navigation = useNavigation();

    const route = useRoute();
    const { id } = route.params as OrderNavigationProps;

    async function handleGoBack() {
        navigation.goBack();
    }

    useEffect(() => {
        if (id) {
            firestore()
                .collection('pizzas')
                .doc(id)
                .get()
                .then((response) => setPizza(response.data() as PizzaResponse))
                .catch(() => Alert.alert('Pedido', 'Não foi possível carregar o produto.'));
        }
    }, []);

    return (
        <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ContentScroll>
                <Header>
                    <ButtonBack
                        onPress={handleGoBack}
                        style={{ marginBottom: 108 }}
                    />
                </Header>

                <Photo source={{ uri: pizza.photo_url }} />

                <Form>
                    <Title>{pizza.name}</Title>
                    <Label>Selecione um tamanho</Label>

                    <Sizes>
                        {
                            PIZZA_TYPES.map((item) => (
                                <RadioButton
                                    key={item.id}
                                    title={item.name}
                                    selected={size === item.id}
                                    onPress={() => setSize(item.id)}
                                />
                            ))
                        }
                    </Sizes>

                    <FormRow>
                        <InputGroup>
                            <Label>Número da mesa</Label>

                            <Input keyboardType='numeric' />
                        </InputGroup>

                        <InputGroup>
                            <Label>Quantidade</Label>

                            <Input keyboardType='numeric' />
                        </InputGroup>
                    </FormRow>

                    <Price>Valor de R$ 00,00</Price>

                    <Button
                        title='Confirmar pedido'
                    />
                </Form>
            </ContentScroll>
        </Container>
    );
}