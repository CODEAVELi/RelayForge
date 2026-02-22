# Safari Packaging Checklist (Sprint 3)

1. Install Xcode + Safari Developer tools.
2. Run Safari Web Extension Converter against `dist/chrome`.
3. Ensure permissions map correctly (`tabs`, `storage`, host access).
4. Verify background service worker lifecycle behavior.
5. Test tab binding + reconnect + queue replay on Safari.
6. Sign extension with Apple Developer certificate.
7. Notarize and package for distribution.
8. Run smoke tests:
   - disconnect/reconnect replay
   - allowlist block behavior
   - diagnostics export
   - audit log persistence
