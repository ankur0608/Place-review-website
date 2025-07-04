import { Ora } from "ora";
import { Filesystem } from "./fs.js";
import ProgressBar from "progress";
export type ErrorType = "invalid filesystem data" | {
    "invalid filesystem or db data": {
        tableName: string;
        componentPath?: string;
    } | null;
} | "invalid filesystem or env vars" | "transient" | "fatal";
export type BigBrainAuth = {
    header: string;
} & ({
    kind: "projectKey";
    projectKey: string;
} | {
    kind: "previewDeployKey";
    previewDeployKey: string;
} | {
    kind: "accessToken";
    accessToken: string;
});
export interface Context {
    fs: Filesystem;
    deprecationMessagePrinted: boolean;
    spinner: Ora | undefined;
    crash(args: {
        exitCode: number;
        errorType: ErrorType;
        errForSentry?: any;
        printedMessage: string | null;
    }): Promise<never>;
    registerCleanup(fn: (exitCode: number, err?: any) => Promise<void>): string;
    removeCleanup(handle: string): (exitCode: number, err?: any) => Promise<void> | null;
    bigBrainAuth(): BigBrainAuth | null;
    /**
     * Prefer using `updateBigBrainAuthAfterLogin` in `deploymentSelection.ts` instead
     */
    _updateBigBrainAuth(auth: BigBrainAuth | null): void;
}
export type OneoffCtx = Context & {
    flushAndExit: (exitCode: number, err?: any) => Promise<never>;
};
export declare const oneoffContext: (args: {
    url?: string;
    adminKey?: string;
    envFile?: string;
}) => Promise<OneoffCtx>;
export declare function logError(ctx: Context, message: string): void;
export declare function logWarning(ctx: Context, ...logged: any): void;
export declare function logMessage(ctx: Context, ...logged: any): void;
export declare function logOutput(ctx: Context, ...logged: any): void;
export declare function logVerbose(ctx: Context, ...logged: any): void;
/**
 * Returns a ProgressBar instance, and also handles clearing the spinner if necessary.
 *
 * The caller is responsible for calling `progressBar.tick()` and terminating the `progressBar`
 * when it's done.
 */
export declare function startLogProgress(ctx: Context, format: string, progressBarOptions: ProgressBar.ProgressBarOptions): ProgressBar;
export declare function showSpinner(ctx: Context, message: string): void;
export declare function changeSpinner(ctx: Context, message: string): void;
export declare function logFailure(ctx: Context, message: string): void;
export declare function logFinishedStep(ctx: Context, message: string): void;
export declare function stopSpinner(ctx: Context): void;
export declare function showSpinnerIfSlow(ctx: Context, message: string, delayMs: number, fn: () => Promise<any>): Promise<void>;
//# sourceMappingURL=context.d.ts.map