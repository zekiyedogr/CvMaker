import React from 'react';
import { View, Text } from 'react-native';

import createStyles from './Achievement.styles';

interface AchievementItem {
    Id: number;
    Title: string;
    Issuer: string;
    Date: string;
    visibility: boolean;
}

interface AchievementProps {
    items: {
        visibility: boolean;
        singularTitle: string;
        pluralTitle: string;
        content: AchievementItem[];
    };
    properties: {
        theme: any;
        sizeValue: number;
        heading: any;
        body: any;
    };
}

const formatMonthYear = (date: string | null) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
};

const Achievement = ({ items, properties }: AchievementProps) => {
    const styles = createStyles(
        properties.theme,
        properties.sizeValue,
        properties.heading,
        properties.body
    );

    if (!items?.visibility || !items.content) return null;

    const visibleItems = items.content.filter(item => item.visibility);

    if (visibleItems.length === 0) return null;

    const title = visibleItems.length > 1
        ? items.pluralTitle
        : items.singularTitle;

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                {title.toUpperCase()}
            </Text>

            <View style={styles.content}>
                {visibleItems.map(item => (
                    <View
                        style={styles.item}
                        key={item.Id}
                    >

                        <Text style={styles.name}>
                            {item.Title}
                        </Text>

                        <View style={styles.footer}>

                            <Text style={styles.issuer}>
                                {item.Issuer}
                            </Text>

                            <Text style={styles.date}>
                                {formatMonthYear(item.Date)}
                            </Text>

                        </View>

                    </View>
                ))}
            </View>

        </View>
    );
};

export default Achievement;
