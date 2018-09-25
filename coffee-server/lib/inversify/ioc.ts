import "reflect-metadata";
import { Container, inject, interfaces } from "inversify";
import { fluentProvide, provide, autoProvide, buildProviderModule } from "inversify-binding-decorators";

const iocContainer = new Container();
iocContainer.load(buildProviderModule());

const provideSingleton = (identifier: any) => {
    return fluentProvide(identifier)
        .inSingletonScope()
        .done();
};

export { iocContainer, autoProvide, inject, provideSingleton, fluentProvide };