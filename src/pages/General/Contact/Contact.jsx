import React from 'react';
import { Container, Box } from '@mui/material';

export default function Contact() {
    return (
        <Container>
            <Box>
                <h1>CONTACT</h1>
                <p data-cy={'contact-email'}>Email: <a href="mailto:parkvision.info@gmail.com">parkvision.info@gmail.com</a></p>
                <p>Authors:</p>
                <ul>
                    <li>Filip Strózik</li>
                    <li>Weronika Litkowska</li>
                    <li>Maciej Makara</li>
                    <li>Szymon Romanek</li>
                </ul>
            </Box>
        </Container>
    );
}
