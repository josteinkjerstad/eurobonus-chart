import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { Profile } from '../../models/profile';
import { supabase } from '../../lib/supabase';
import './ProfileSection.scss';

type ProfileSectionProps = {
  profile: Profile;
};

export const ProfileSection = ({ profile }: ProfileSectionProps) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      display_name: profile?.display_name ?? '',
      public: profile?.public ?? false,
    },
  });
  const [isEditing, setIsEditing] = useState(false);

  const updateProfile = async (data: { display_name: string; public: boolean }) => {
    await supabase.from('profiles').update(data).eq('user_id', profile.user_id);
    setIsEditing(false);
    reset(data);
  };

  return (
    <section className="profile-section">
      <h2>Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit(updateProfile)}>
          <label>
            Display Name:
            <Controller
              name="display_name"
              control={control}
              render={({ field }) => <input type="text" {...field} />}
            />
          </label>
          <label>
            Public:
            <Controller
              name="public"
              control={control}
              render={({ field }) => <input type="checkbox" {...field} checked={field.value} value={undefined} />}
            />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p><strong>Display Name:</strong> {profile.display_name || 'Anonymous'}</p>
          <p><strong>Public:</strong> {profile.public ? 'Yes' : 'No'}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </section>
  );
};
