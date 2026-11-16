
import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    LayoutChangeEvent,
} from 'react-native';

import IconButton from '../../components/IconButton/IconButton';
import Contact from './components/Contact/Contact';
import Education from './components/Education/Education';
import ListItem from './components/ListItem/ListItem';
import Project from './components/Project/Project';
import Summary from './components/Summary/Summary';
import Experience from './components/Experience/Experience';
import Achievement from './components/Achievement/Achievement';
import Reference from './components/Reference/Reference';

import api from '../../services/api';
import createStyles from './ClassicCv.styles';

interface ClassicProps {
    contentProfile: any;
    onEditSection: (section: string) => void;
}

const ClassicCv = ({ contentProfile, onEditSection }: ClassicProps) => {
    const {
        personalInformation,
        summary,
        contact,
        educations,
        workExperience,
        projects,
        skills,
        languages,
        certifications,
        awards,
        hobbies,
        references,
        theme,
        sizes,
        heading,
        body,
        isEditing
    } = contentProfile;

    const [containerWidth, setContainerWidth] = useState(0);

    const scale = containerWidth > 0
        ? containerWidth / 794
        : 1;

    const styles = createStyles(
        theme,
        contentProfile.sizeValue,
        heading,
        scale
    );

    const properties = {
        theme,
        sizeValue: contentProfile.sizeValue * scale,
        heading,
        body,
    };

    const handleLayout = (event: LayoutChangeEvent) => {
        setContainerWidth(event.nativeEvent.layout.width);
    };

    // Fotoğraf URL'si
    const photoValue = personalInformation.photo.value;

    const serverUrl = (api.defaults.baseURL ?? '')
        .replace(/\/api\/?$/, '');

    const imageUri = photoValue
        ? photoValue.startsWith('http')
            ? photoValue
            : `${serverUrl}${photoValue}`
        : null;

    return (
        <View
            style={styles.container}
            onLayout={handleLayout}
        >
            {/* LEFT */}
            <View style={styles.left}>

                {/* PHOTO */}
                {personalInformation.photo.visibility && (
                    <View style={styles.imgContainer}>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.profileImg}
                            resizeMode="cover"
                        />

                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('photo')}
                                />
                            </View>
                        )}
                    </View>
                )}

                {/* CONTACT */}
                {contact.visibility && (
                    <View style={styles.innerContainer}>
                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('contact')}
                                />
                            </View>
                        )}

                        <Contact
                            contact={contact}
                            properties={properties}
                        />
                    </View>
                )}

                {/* EDUCATION */}
                {educations.visibility && (
                    <View style={styles.innerContainer}>
                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('contact')}
                                />
                            </View>
                        )}

                        <Education
                            education={educations}
                            properties={properties}
                        />
                    </View>
                )}

                {/* SKILLS */}
                {skills.visibility && (
                    <View style={styles.innerContainer}>
                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('skills')}
                                />
                            </View>
                        )}
                        <ListItem
                            items={skills}
                            properties={properties}
                        />
                    </View>
                )}

                {/* LANGUAGES */}
                {languages.visibility && (
                    <View style={styles.innerContainer}>
                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('languages')}
                                />
                            </View>
                        )}
                        <ListItem
                            items={languages}
                            properties={properties}
                        />
                    </View>
                )}

                {/* HOBBIES */}
                {hobbies.visibility && (
                    <View style={styles.innerContainer}>
                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('hobbies')}
                                />
                            </View>
                        )}
                        <ListItem
                            items={hobbies}
                            properties={properties}
                        />
                    </View>
                )}

                {/* PROJECT */}
                {projects.visibility && (
                    <View style={styles.innerContainer}>
                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('projects')}
                                />
                            </View>
                        )}
                        <Project
                            projects={projects}
                            properties={properties}
                        />
                    </View>
                )}

            </View>

            {/* RIGHT */}
            <View style={styles.right}>
                <View style={styles.nameContainer}>
                    <View style={styles.nameHeader}>

                        {/* NAME */}
                        <View style={styles.name}>
                            <Text style={styles.firstName}>
                                {personalInformation.firstName?.toUpperCase()}
                            </Text>

                            <Text style={styles.lastName}>
                                {personalInformation.lastName?.toUpperCase()}
                            </Text>
                        </View>

                        {/* PROFESSION */}
                        {personalInformation.profession && (
                            <Text style={styles.profession}>
                                {personalInformation.profession.toUpperCase()}
                            </Text>
                        )}

                        {/* LINE */}
                        <View style={styles.line} />

                        {/* EDIT BUTTON */}
                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('cvSections')}
                                />
                            </View>
                        )}

                    </View>
                </View>

                {/* SUMMARY */}
                {summary.visibility && (
                    <View style={styles.innerContainer}>
                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('summary')}
                                />
                            </View>
                        )}

                        <Summary
                            summary={summary}
                            properties={properties}
                        />
                    </View>
                )}

                {/* EXPERIENCES */}
                {workExperience.visibility && (
                    <View style={styles.innerContainer}>
                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('workExperience')}
                                />
                            </View>
                        )}

                        <Experience
                            experience={workExperience}
                            properties={properties}
                        />
                    </View>
                )}

                {/* CERTIFICATIONS */}
                {certifications.visibility && (
                    <View style={styles.innerContainer}>
                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('certifications')}
                                />
                            </View>
                        )}

                        <Achievement
                            items={certifications}
                            properties={properties}
                        />
                    </View>
                )}

                {/* AWARD */}
                {awards.visibility && (
                    <View style={styles.innerContainer}>
                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('awards')}
                                />
                            </View>
                        )}

                        <Achievement
                            items={awards}
                            properties={properties}
                        />
                    </View>
                )}

                {/* REFERENCES */}
                {references.visibility && (
                    <View style={styles.innerContainer}>
                        {isEditing && (
                            <View style={styles.editbutton}>
                                <IconButton
                                    icon="edit"
                                    onPress={() => onEditSection('references')}
                                />
                            </View>
                        )}

                        <Reference
                            references={references}
                            properties={properties}
                        />
                    </View>
                )}
            </View>

        </View>
    );
};

export default ClassicCv;
