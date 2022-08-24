import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import {
    Container,
    Image,
    Name,
    Description,
    StatusContainer,
    StatusLabel,
} from './styles';

type Props = TouchableOpacityProps & {
    index: number;
}

export function OrderCard({ index, ...rest }: Props) {
    return (
        <Container index={index} {...rest}>
            <Image source={{ uri: 'https://github.com/neanderdev.png' }} />

            <Name>Pizza de Frango</Name>

            <Description>
                Mesa 5 | Qnt: 1
            </Description>

            <StatusContainer status='Pronto'>
                <StatusLabel status='Pronto'>
                    Pronto
                </StatusLabel>
            </StatusContainer>
        </Container>
    );
}