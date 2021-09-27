import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ROLES_KEY } from "../decorators/role.decorator";
import { Reflector } from "@nestjs/core";
import { Role } from "../role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredRoles || requiredRoles.length === 0)
            return true;

        const { user } = context.switchToHttp().getRequest();
        if (user.role === Role.ADMIN)
            return true;

        return requiredRoles.some((role) => (user.role === role));
    }
}