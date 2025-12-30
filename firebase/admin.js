// Backwards-compatible alias: some code imports '@/firebase/admin'
// Keep this file to avoid 'Module not found: @/firebase/admin' errors.
export * from "./firebaseAdmin";

// Default export for convenience
import { adminDb } from "./firebaseAdmin";
export default adminDb;
