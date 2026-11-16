
import React from 'react';
import { View, Text } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import createStyles from './Contact.styles';

interface ContactItem {
    field: string;
    value: string;
    visibility: boolean;
}

interface ContactProps {
    contact: {
        visibility: boolean;
        content: ContactItem[];
    };
    properties: {
        theme: any;
        sizeValue: number;
        heading: any;
        body: any;
    };
}

const contactIcons: Record<string, { name: string; type: number }> = {
    phone: { name: 'phone', type: 1 },
    location: { name: 'map-marker', type: 1 },
    email: { name: 'envelope', type: 1 },
    linkedin: { name: 'linkedin', type: 1 },
    github: { name: 'github', type: 1 },
    portfolio: { name: 'globe', type: 1 },
    x: { name: 'twitter', type: 1 },
    medium: { name: 'medium', type: 1 },
    devto: { name: 'dev', type: 2 },
    hashnode: { name: 'link', type: 1 },
    dribbble: { name: 'dribbble', type: 1 },
    behance: { name: 'behance', type: 1 },
    stackoverflow: { name: 'stack-overflow', type: 1 },
    skype: { name: 'skype', type: 1 },
    zoom: { name: 'video-camera', type: 1 },
    discord: { name: 'discord', type: 2 },
};

const urlFields = [
    'linkedin',
    'github',
    'portfolio',
    'x',
    'medium',
    'devto',
    'hashnode',
    'dribbble',
    'behance',
    'stackoverflow',
    'skype',
    'zoom',
    'discord',
];

const formatValue = (key: string, value: string) => {
    if (!urlFields.includes(key)) return value;

    try {
        const url = new URL(
            /^https?:\/\//i.test(value)
                ? value
                : `https://${value}`
        );

        if (key === 'portfolio') {
            return url.hostname.replace(/^www\./, '');
        }

        return url.pathname.replace(/\/$/, '') || url.hostname;
    } catch {
        return value;
    }
};

const Contact = ({ contact, properties }: ContactProps) => {
    const styles = createStyles(
        properties.theme,
        properties.sizeValue,
        properties.heading,
        properties.body
    );

    if (!contact?.visibility) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CONTACT</Text>

            {contact.content.map(item => {
                const iconData = contactIcons[item.field];

                if (!item.visibility || !item.value || !iconData) {
                    return null;
                }

                const IconComponent =
                    iconData.type === 2 ? FontAwesome5 : Icon;

                return (
                    <View
                        style={styles.contactItem}
                        key={item.field}
                    >
                        <IconComponent
                            name={iconData.name}
                            style={styles.contactIcon}
                        />

                        <Text style={styles.contactText}>
                            {formatValue(item.field, item.value)}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

export default Contact;
