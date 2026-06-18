import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/user.entity';

export const ROLES_KEY = 'roles';

// Usage: @Roles(UserRole.ADMIN) above a controller or handler.
// This is the same idea as Spring Security's @PreAuthorize("hasRole(...)") —
// the guard below is what actually enforces it.
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
