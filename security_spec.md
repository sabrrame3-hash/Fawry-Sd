# Firebase Security Specification

## Data Invariants
1. A user can only access their own profile data (`/users/{uid}`).
2. A user can only view their own transfer history (`transfers` where `senderId == request.auth.uid`).
3. A user can only view their own payment history (`payments` where `userId == request.auth.uid`).
4. Timestamps must be server-generated (`request.time`).
5. Transaction amounts must be positive numbers.
6. Account numbers must follow a specific format (regex validation).

## The Dirty Dozen Payloads (Rejection Tests)

1. **Identity Spoofing**: Creating a user profile with a different UID than the authenticated user.
2. **Balance Hack**: Updating balance to a huge number directly from the client.
3. **Orphaned Transfer**: Creating a transfer without a valid senderId.
4. **Negative Payment**: Sending a payment with a negative amount.
5. **Ghost Fields**: Adding `isAdmin: true` to a user profile.
6. **Cross-User Read**: Trying to `get` another user's profile.
7. **Cross-User List**: Querying all transfers without filtering by `senderId`.
8. **Immutable Field Change**: Trying to change `accountNumber` after creation.
9. **Junk ID Poisoning**: Using a 2KB string as a document ID.
10. **Self-Promotion**: Updating own profile to set a custom claim or role field.
11. **PII Leak**: Accessing the `users` collection without proper authentication.
12. **Future Timestamp**: Sending a `timestamp` field set to next year.

## Test Runner (Spec)
The `firestore.rules.test.ts` will verify:
- `create /users/{uid}`: Only if `uid == request.auth.uid` and fields are valid.
- `update /users/{uid}`: Only allows specific fields (e.g., name) and prevents balance/account number tampering.
- `create /transfers/{tid}`: Only if `senderId == request.auth.uid`.
- `list /transfers`: Only if filtered by `senderId`.
