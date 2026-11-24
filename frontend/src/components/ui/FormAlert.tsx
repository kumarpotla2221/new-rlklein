/** Red message box for a form that could not be sent (same look as the Apply page). */
export function FormAlert({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      style={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', padding: '12px 16px', borderRadius: 4, marginBottom: 24, fontSize: '14px' }}
    >
      {message}
    </div>
  );
}
