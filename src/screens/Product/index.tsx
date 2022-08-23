import React, { useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { ButtonBack } from '@components/ButtonBack';
import { Photo } from '@components/Photo';
import { InputPrice } from '@components/InputPrice';

import {
    Container,
    Header,
    Title,
    DeleteLabel,
    Upload,
    PickImageButton,
} from './styles';

export function Product() {
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState('');

    async function handlePickerImage() {
        setIsLoading(true);

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status === 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 4],
            });

            if (!result.cancelled) {
                setImage(result.uri);
            }
        }

        setIsLoading(false);
    }

    return (
        <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Header>
                <ButtonBack />

                <Title>
                    Cadastrar
                </Title>

                <TouchableOpacity>
                    <DeleteLabel>
                        Deletar
                    </DeleteLabel>
                </TouchableOpacity>
            </Header>

            <Upload>
                <Photo uri={image} />

                <PickImageButton
                    title='Carregar'
                    type='secondary'
                    onPress={handlePickerImage}
                    isLoading={isLoading}
                />
            </Upload>

            <InputPrice size='P' />
            <InputPrice size='M' />
            <InputPrice size='G' />
        </Container>
    );
}