if (/(?:^#|&)(?:invite_token|confirmation_token|recovery_token|email_change_token)=/.test(window.location.hash)) {
    window.location.replace(`/admin${window.location.hash}`);
}
