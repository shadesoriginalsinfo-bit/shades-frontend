export const isEmpty = (val?: string) => !val || val.trim().length === 0;

export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_!#$%&*])[A-Za-z\d@_!#$%&*]{8,}$/;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
