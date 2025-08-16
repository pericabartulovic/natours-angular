src/
app/
core/ # Singleton/global services, interceptors, guards, app-level models - auth.service.ts - http-interceptor.ts - logger.service.ts

    shared/       # Highly reusable UI pieces (buttons, inputs), pipes, directives
      components/
        - button/
          - button.component.ts
          - button.component.html
          - button.component.scss
        - card/
        - avatar/
      directives/
        - clickOutside.directive.ts
      pipes/
        - currency.pipe.ts

    features/     # Everything grouped by business domain/feature (users, tours etc.)
      users/
        components/
          - user-list/
          - user-detail/
        services/
          - user.service.ts
        models/
          - user.model.ts
        users.module.ts
        users-routing.module.ts

      tours/
        components/
          - tour-list/
          - tour-detail/
        services/
          - tour.service.ts
        models/
          - tour.model.ts
        tours.module.ts
        tours-routing.module.ts

    layout/       # App-level layouts (header, footer, navigation)
      header/
      footer/
      sidebar/
    app.module.ts
    app-routing.module.ts

assets/
styles/
\_variables.scss
\_mixins.scss
main.scss
images/
fonts/

environments/
environment.ts
environment.prod.ts

index.html
styles.scss
main.ts
