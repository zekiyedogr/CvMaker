
import React from 'react';
import { View, Text } from 'react-native';

import createStyles from './ListItem.styles';

interface ListItemProps {
    items: {
        visibility: boolean;
        singularTitle: string;
        pluralTitle: string;
        content: any[];
    };
    properties: {
        theme: any;
        sizeValue: number;
        heading: any;
        body: any;
    };
    lang?: Record<string, any>;
}

const languageLevels = [
    'Beginner',
    'Elementary',
    'Intermediate',
    'Upper Intermediate',
    'Advanced',
    'Native',
];

const getLanguageLevel = (
    level: string,
    lang?: Record<string, any>
) => {
    if (!languageLevels.includes(level)) {
        return level;
    }

    return lang?.[level] || level;
};

const ListItem = ({ items, properties, lang }: ListItemProps) => {
    const styles = createStyles(
        properties.theme,
        properties.sizeValue,
        properties.heading,
        properties.body
    );

    if (!items?.visibility || !items.content) return null;

    const type = items.pluralTitle.toLowerCase();

    let formattedList: { id: number | string; name: string }[] = [];

    // HOBBIES
    if (type === 'hobbies') {
        formattedList = items.content
            .filter(item => item.visibility)
            .map(item => ({
                id: item.Id,
                name: item.Name,
            }));
    }

    // LANGUAGES
    else if (type === 'languages') {
        formattedList = items.content
            .filter(item => item.visibility)
            .map(item => ({
                id: item.Id,
                name: `${item.Name} ( ${getLanguageLevel(item.Levels, lang)} )`,
            }));
    }

    // SKILLS
    else if (type === 'skills') {
        const all: { id: number | string; name: string }[] = [];

        items.content.forEach(group => {
            if (!group.visibility) return;

            (group.items || []).forEach((skill: any) => {
                if (skill.visibility) {
                    all.push({
                        id: skill.Id,
                        name: skill.Name,
                    });
                }
            });
        });

        formattedList = all;
    }

    if (formattedList.length === 0) return null;

    const title = formattedList.length > 1
        ? items.pluralTitle
        : items.singularTitle;

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                {title.toUpperCase()}
            </Text>

            <View style={styles.listContent}>
                {formattedList.map(item => (
                    <View
                        style={styles.listRow}
                        key={item.id}
                    >
                        <Text style={styles.bullet}>•</Text>

                        <Text style={styles.content}>
                            {item.name}
                        </Text>
                    </View>
                ))}
            </View>

        </View>
    );
};

export default ListItem;
