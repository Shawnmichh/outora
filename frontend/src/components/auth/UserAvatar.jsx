import { getAvatarById } from '../../utils/avatars';

/**
 * Renders a user's avatar using CSS background-image so it always
 * fills and centers correctly at any size passed via className.
 *
 * className receives sizing + ring from the caller, e.g.:
 *   "h-7 w-7 ring-1 ring-[var(--color-border)]"
 *
 * We add: overflow-hidden, rounded-full, and the background styles.
 */
function UserAvatar({ avatarId, alt, className = '' }) {
  const avatar = getAvatarById(avatarId);

  return (
    <span
      role="img"
      aria-label={alt ?? 'User avatar'}
      className={[
        'inline-block shrink-0 overflow-hidden rounded-full',
        className,
      ].join(' ')}
      style={{
        backgroundColor: avatar.bg,
        backgroundImage: `url(${avatar.src})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}

export default UserAvatar;
