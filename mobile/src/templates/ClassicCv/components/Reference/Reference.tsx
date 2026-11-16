
import React from 'react';
import { View, Text } from 'react-native';

import createStyles from './Reference.styles';

interface ReferenceItem {
    Id: number;
    Name: string;
    Position: string;
    Contact: string;
    visibility: boolean;
}

interface ReferenceProps {
    references: {
        visibility: boolean;
        singularTitle: string;
        pluralTitle: string;
        content: ReferenceItem[];
    };
    properties: {
        theme: any;
        sizeValue: number;
        heading: any;
        body: any;
    };
}

const Reference = ({ references, properties }: ReferenceProps) => {
    const styles = createStyles(
        properties.theme,
        properties.sizeValue,
        properties.heading,
        properties.body
    );

    if (!references?.visibility || !references.content) return null;

    const visibleReferences = references.content.filter(
        ref => ref.visibility
    );

    if (visibleReferences.length === 0) return null;

    const title = visibleReferences.length > 1
        ? references.pluralTitle
        : references.singularTitle;

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                {title.toUpperCase()}
            </Text>

            <View style={styles.content}>
                {visibleReferences.map(ref => (
                    <View
                        style={styles.item}
                        key={ref.Id}
                    >

                        <Text style={styles.name}>
                            {ref.Name}
                        </Text>

                        <Text style={styles.position}>
                            {ref.Position}
                        </Text>

                        <View style={styles.contact}>
                            <Text style={styles.contactTitle}>
                                Contact:
                            </Text>

                            <Text style={styles.contactInfo}>
                                {ref.Contact}
                            </Text>
                        </View>

                    </View>
                ))}
            </View>

        </View>
    );
};

export default Reference;
