import { useEffect, useState } from 'react';
import TextInput from '../TextInput/TextInput';
import DatePicker from '../DatePicker/DatePicker';
import DeleteButton from '../DeleteButton/DeleteButton';
import AddButton from '../AddButton/AddButton';
import './EditDocuments.css';

export interface Document {
    Id?: number;
    ProfileId?: number;
    Title: string;
    Issuer: string;
    Date: string | null;
}

interface EditDocumentsProps {
    data: Document[] | null;
    onChange: (documents: Document[]) => void;
    type: 'certifications' | 'awards';
}

const formatDate = (date: string | null | undefined): string => {
    if (!date) return '';
    return date.substring(0, 10);
};

const normalizeDocuments = (
    data: Document[] | null | undefined
): Document[] => {
    return (data ?? []).map(document => ({
        ...document,
        Date: formatDate(document.Date) || null
    }));
};

const EditDocuments = ({ data, onChange, type }: EditDocumentsProps) => {
    const [documents, setDocuments] = useState<Document[]>([]);

    const title = type === 'certifications' ? 'Certification' : 'Award';

    useEffect(() => {
        setDocuments(normalizeDocuments(data));
    }, [data]);

    const updateDocuments = (updatedDocuments: Document[]) => {
        setDocuments(updatedDocuments);
        onChange(updatedDocuments);
    };

    const handleAddDocument = () => {
        const newDocument: Document = {
            Title: '',
            Issuer: '',
            Date: null
        };

        updateDocuments([...documents, newDocument]);
    };

    const handleDeleteDocument = (index: number) => {
        const updatedDocuments = documents.filter(
            (_, documentIndex) => documentIndex !== index
        );

        updateDocuments(updatedDocuments);
    };

    const handleFieldChange = (
        index: number,
        field: keyof Document,
        value: string
    ) => {
        const updatedDocuments = documents.map((document, documentIndex) => {
            if (documentIndex !== index) return document;

            return {
                ...document,
                [field]: value
            };
        });

        updateDocuments(updatedDocuments);
    };

    return (
        <div className="edit-documents-container">
            {documents.map((document, index) => (
                <div
                    className="edit-documents-item"
                    key={document.Id ?? `new-${index}`}
                >
                    <div className="edit-documents-header">
                        <h3>{title} {index + 1}</h3>

                        <DeleteButton
                            iconOnly
                            onClick={() => handleDeleteDocument(index)}
                        />
                    </div>

                    <TextInput
                        label={`${title} Title`}
                        name={`title-${index}`}
                        value={document.Title}
                        onChange={(value) =>
                            handleFieldChange(index, 'Title', value)
                        }
                        placeholder={`Enter ${title.toLowerCase()} title`}
                    />

                    <TextInput
                        label="Issuer"
                        name={`issuer-${index}`}
                        value={document.Issuer}
                        onChange={(value) =>
                            handleFieldChange(index, 'Issuer', value)
                        }
                        placeholder="Enter issuer"
                    />

                    <DatePicker
                        label="Date"
                        value={document.Date ?? ''}
                        onChange={(value) =>
                            handleFieldChange(index, 'Date', value)
                        }
                    />
                </div>
            ))}

            <AddButton
                label={`Add ${title}`}
                onClick={handleAddDocument}
            />
        </div>
    );
};

export default EditDocuments;
