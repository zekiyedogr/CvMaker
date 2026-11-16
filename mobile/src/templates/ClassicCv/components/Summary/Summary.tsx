
import React from 'react';
import { View, Text } from 'react-native';

import createStyles from './Summary.styles';

interface ProfileProps {
    summary: {
        visibility: boolean;
        careerSummary: {
            text: string | null;
            visibility: boolean;
        };
        careerGoals: {
            text: string | null;
            visibility: boolean;
        };
    };
    properties: {
        theme: any;
        sizeValue: number;
        heading: any;
        body: any;
    };
}

const Summary = ({ summary, properties }: ProfileProps) => {
    const styles = createStyles(
        properties.theme,
        properties.sizeValue,
        properties.heading,
        properties.body
    );

    if (!summary?.visibility) return null;

    const showSummary =
        summary.careerSummary.visibility &&
        Boolean(summary.careerSummary.text);

    const showGoals =
        summary.careerGoals.visibility &&
        Boolean(summary.careerGoals.text);

    if (!showSummary && !showGoals) return null;

    return (
        <View style={styles.container}>

            {showSummary && (
                <View style={styles.section}>
                    <Text style={styles.title}>
                        CAREER SUMMARY
                    </Text>

                    <Text style={styles.content}>
                        {summary.careerSummary.text}
                    </Text>
                </View>
            )}

            {showGoals && (
                <View style={styles.section}>
                    <Text style={styles.title}>
                        MY GOALS
                    </Text>

                    <Text style={styles.content}>
                        {summary.careerGoals.text}
                    </Text>
                </View>
            )}

        </View>
    );
};

export default Summary;
