/** @odoo-module **/

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

export const basicModelOpsNotificationService = {
    dependencies: ["notification", "action"],

    start(env, { notification }) {
        env.bus.on("WEB_CLIENT_READY", null, async () => {
            const legacyEnv = owl.Component.env,
                actionService = useService("action");
            legacyEnv.services.bus_service.onNotification(
                this,
                (notifications) => {
                    for (const { payload, type } of notifications) {
                        if (type === "notify-record-operation") {
                            notification.add(payload.message, {
                                type: payload.type,
                                sticky: payload.sticky,
                            });
                            if (payload.next) {
                                // It is assume that an action must be "trigger"...
                                actionService.doAction(payload.next);
                            }
                        }
                        if (type === "notify-record-created") {
                            //
                        }
                        if (type === "notify-record-modified") {
                            //
                        }
                        if (type === "notify-record-deleted") {
                            //
                        }
                    }
                }
            );
            legacyEnv.services.bus_service.startPolling();
        });
    },
};

registry
    .category("services")
    .add("basicModelOpsNotification", basicModelOpsNotificationService);
