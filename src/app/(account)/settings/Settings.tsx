import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AccountSettings from './AccountSettings';
import MembershipSettings from './MembershipSettings';
import NotificationsSettings from './NotificationsSettings';
import PersonalInfoSettings from './PersonalInfoSettings';

interface SettingsProps {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}

export default function Settings({ selectedTab, setSelectedTab }: SettingsProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const { user } = useUser();
    const [membershipStatus, setMembershipStatus] = useState('Checking...');
    const [membershipExpirationDate, setMembershipExpirationDate] = useState('');

    const handleGoToMembership = () => {
        setSelectedTab('membership');
    };

    const onSubmit = (data: any) => {
        // TODO: Send data to Clerk via API
        console.log(data);
    };

    const renderSettings = () => {
        switch (selectedTab) {
            case 'account':
                return (
                    <AccountSettings
                        user={user}
                        register={register}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        onSubmit={onSubmit}
                        handleGoToMembership={handleGoToMembership}
                        membershipStatus={membershipStatus}
                        setMembershipStatus={setMembershipStatus}
                        setMembershipExpirationDate={setMembershipExpirationDate}
                    />
                );
            case 'personalInfo':
                return (
                    <PersonalInfoSettings
                        register={register}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        onSubmit={onSubmit}
                    />
                );
            case 'membership':
                return (
                    <MembershipSettings
                        membershipStatus={membershipStatus}
                        setMembershipStatus={setMembershipStatus}
                        membershipExpirationDate={membershipExpirationDate}
                        setMembershipExpirationDate={setMembershipExpirationDate}
                    />
                );
            case 'notifications':
                return <NotificationsSettings />;
            default:
                return null;
        }
    };

    return <div className="flex">{renderSettings()}</div>;
}
