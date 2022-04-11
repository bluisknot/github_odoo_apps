odoo.define(
    "model_basic_ops_notifications.relational_fields",
    function (require) {
        "use strict";

        var core = require("web.core");
        var _t = core._t;
        var dialogs = require("web.view_dialogs");
        var relational_fields = require("web.relational_fields");
        var FieldMany2Many = relational_fields.FieldMany2Many;

        FieldMany2Many.include({
            /**
             * @override
             * To recover notifications on the Many2many create pop up dialog.
             */
            onAddRecordOpenDialog: function () {
                console.info("onAddRecordOpenDialog");
                var self = this;
                var domain = this.record.getDomain({ fieldName: this.name });

                var context = this.record.getContext(this.recordParams);
                if (context["suppress_notifications"]) {
                    delete context["suppress_notifications"];
                }
                new dialogs.SelectCreateDialog(this, {
                    res_model: this.field.relation,
                    domain: domain.concat([
                        "!",
                        ["id", "in", this.value.res_ids],
                    ]),
                    context: context,
                    title: _t("Add: ") + this.string,
                    no_create:
                        this.nodeOptions.no_create ||
                        !this.activeActions.create ||
                        !this.canCreate,
                    fields_view: this.attrs.views.form,
                    kanban_view_ref: this.attrs.kanban_view_ref,
                    on_selected: function (records) {
                        var resIDs = _.pluck(records, "id");
                        var newIDs = _.difference(resIDs, self.value.res_ids);
                        if (newIDs.length) {
                            var values = _.map(newIDs, function (id) {
                                return { id: id };
                            });
                            self._setValue({
                                operation: "ADD_M2M",
                                ids: values,
                            });
                        }
                    },
                }).open();
            },

            /**
             * @override
             * To recover notifications on the Many2many create pop up dialog.
             */
            _onOpenRecord: function (ev) {
                console.info("_onOpenRecord");
                var self = this;
                var context = this.record.getContext(this.recordParams);
                if (context["suppress_notifications"]) {
                    delete context["suppress_notifications"];
                }
                _.extend(ev.data, {
                    context: context,
                    domain: this.record.getDomain(this.recordParams),
                    fields_view: this.attrs.views && this.attrs.views.form,
                    on_saved: function () {
                        self._setValue(
                            { operation: "TRIGGER_ONCHANGE" },
                            { forceChange: true }
                        ).then(function () {
                            self.trigger_up("reload", { db_id: ev.data.id });
                        });
                    },
                    on_remove: function () {
                        self._setValue({
                            operation: "FORGET",
                            ids: [ev.data.id],
                        });
                    },
                    readonly: this.mode === "readonly",
                    deletable:
                        this.activeActions.delete &&
                        this.view.arch.tag !== "tree" &&
                        this.canDelete,
                    string: this.string,
                });
            },
        });
    }
);
