import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const profileSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  birth_date: z.string().optional(),
  avatar_url: z.string().optional(),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, 'Senha atual obrigatória'),
    new_password: z.string().min(8, 'Nova senha deve ter no mínimo 8 caracteres'),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

function AvatarPreview({ url }: { url: string }) {
  if (!url) {
    return (
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xl">
        ?
      </div>
    );
  }
  return (
    <img
      src={url}
      alt="Avatar preview"
      className="w-16 h-16 rounded-full object-cover border border-border"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = '';
        e.currentTarget.style.display = 'none';
        (e.currentTarget.nextSibling as HTMLElement | null)?.removeAttribute('style');
      }}
    />
  );
}

export function AccountPage() {
  const { user, updateUser } = useAuth();
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      birth_date: user?.birth_date ?? '',
      avatar_url: user?.avatar_url ?? '',
    },
  });

  const watchedAvatarUrl = profileForm.watch('avatar_url') ?? '';

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
  });

  const onProfileSubmit = async (values: ProfileValues) => {
    setProfileSuccess('');
    setProfileError('');

    const body: Record<string, string | null> = { name: values.name };
    if (values.birth_date !== undefined) body.birth_date = values.birth_date || null;
    if (values.avatar_url !== undefined) body.avatar_url = values.avatar_url || null;

    const res = await apiFetch('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) {
      setProfileError(data.error ?? 'Erro ao salvar perfil');
      return;
    }

    updateUser({
      name: data.name,
      birth_date: data.birth_date,
      avatar_url: data.avatar_url,
    });
    setProfileSuccess('Perfil atualizado com sucesso!');
  };

  const onPasswordSubmit = async (values: PasswordValues) => {
    setPasswordSuccess('');
    setPasswordError('');

    const res = await apiFetch('/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify({
        current_password: values.current_password,
        new_password: values.new_password,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setPasswordError(
        res.status === 401 ? 'Senha atual incorreta' : (data.error ?? 'Erro ao trocar senha'),
      );
      return;
    }

    setPasswordSuccess('Senha atualizada com sucesso!');
    passwordForm.reset();
  };

  return (
    <div className="px-4 pt-16 pb-8 md:pt-8 md:px-8 max-w-xl space-y-10">
      <h1 className="text-2xl font-semibold">Minha Conta</h1>

      {/* Personal data section */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium border-b border-border pb-2">Dados pessoais</h2>

        <div className="flex items-center gap-4">
          <AvatarPreview url={watchedAvatarUrl} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user?.email ?? ''} readOnly className="opacity-60 cursor-not-allowed" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" placeholder="Seu nome" {...profileForm.register('name')} />
            {profileForm.formState.errors.name && (
              <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="birth_date">Data de nascimento</Label>
            <Input id="birth_date" type="date" {...profileForm.register('birth_date')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="avatar_url">URL do avatar</Label>
            <Input id="avatar_url" placeholder="https://..." {...profileForm.register('avatar_url')} />
          </div>
          {profileError && <p className="text-xs text-destructive">{profileError}</p>}
          {profileSuccess && <p className="text-xs text-green-600">{profileSuccess}</p>}
          <Button type="submit" disabled={profileForm.formState.isSubmitting}>
            {profileForm.formState.isSubmitting ? 'Salvando...' : 'Salvar perfil'}
          </Button>
        </form>
      </section>

      {/* Security section */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium border-b border-border pb-2">Segurança</h2>

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="current_password">Senha atual</Label>
            <Input id="current_password" type="password" placeholder="••••••••" {...passwordForm.register('current_password')} />
            {passwordForm.formState.errors.current_password && (
              <p className="text-xs text-destructive">{passwordForm.formState.errors.current_password.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new_password">Nova senha</Label>
            <Input id="new_password" type="password" placeholder="Mínimo 8 caracteres" {...passwordForm.register('new_password')} />
            {passwordForm.formState.errors.new_password && (
              <p className="text-xs text-destructive">{passwordForm.formState.errors.new_password.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm_password">Confirmar nova senha</Label>
            <Input id="confirm_password" type="password" placeholder="••••••••" {...passwordForm.register('confirm_password')} />
            {passwordForm.formState.errors.confirm_password && (
              <p className="text-xs text-destructive">{passwordForm.formState.errors.confirm_password.message}</p>
            )}
          </div>
          {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
          {passwordSuccess && <p className="text-xs text-green-600">{passwordSuccess}</p>}
          <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
            {passwordForm.formState.isSubmitting ? 'Salvando...' : 'Trocar senha'}
          </Button>
        </form>
      </section>
    </div>
  );
}
