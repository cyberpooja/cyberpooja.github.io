// Shared by the existing content routes and the tablet's application windows.
export const researchStudies = [
 ['01','Runtime trust on Android','Tracing client-side integrity checks and understanding why the server must make authorization decisions.','android-root-detection'],
 ['02','Transport security under observation','Exploring certificate pinning in an authorized laboratory and documenting what each layer protects.','understanding-ssl-pinning'],
 ['03','Mapping the mobile attack surface','A repeatable workflow for moving from a package to a useful threat model.','android-attack-surface'],
] as const;
export const projects = [
 ['01','Vault Lab','The browser-based Android assessment on this site. Two deterministic Frida command challenges with no device connection.','TypeScript · React','/','Open interactive lab'],
 ['02','Hook Notebook','A planned collection of documented instrumentation patterns for authorized Android test environments.','Frida · JavaScript',null,'Repository coming soon'],
 ['03','Surface Mapper','A project concept for organizing exported components, deep links, and API entry points during a mobile assessment.','Python · Android',null,'Repository coming soon'],
] as const;
export const talks = [
 ['Workshop outline','An introduction to Android runtime instrumentation','A guided laboratory covering observation, hooks, and interpreting application behavior.'],
 ['Talk outline','Client-side trust is a design decision','What root checks and certificate pinning can—and cannot—tell you about the security of a mobile system.'],
] as const;
