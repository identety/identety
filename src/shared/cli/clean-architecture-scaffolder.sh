#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./clean-architecture-scaffold.sh <module-name>"
    exit 1
fi

MODULE_NAME=$1
MODULE_NAME_CAPITAL="$(tr '[:lower:]' '[:upper:]' <<< ${MODULE_NAME:0:1})${MODULE_NAME:1}"
BASE_DIR="src/modules/$MODULE_NAME"

mkdir -p "$BASE_DIR"/{domain/models,application/{ports,services},interface/http/dtos,__test__}

cat > "$BASE_DIR/domain/models/${MODULE_NAME}.ts" << EOF
export interface $MODULE_NAME_CAPITAL {
    id: string;
    // Add your domain properties here

    createdAt: Date;
    updatedAt: Date;
}
EOF

cat > "$BASE_DIR/application/ports/${MODULE_NAME}.repository.ts" << EOF
export class ${MODULE_NAME_CAPITAL}Repository {
  constructor() {}

  findById(id: string): Promise<string> {
    return Promise.resolve('auth:' + id);
  }
}
EOF


cat > "$BASE_DIR/application/services/${MODULE_NAME}.service.ts" << EOF
import { Injectable } from '@nestjs/common';
import { ${MODULE_NAME_CAPITAL}Repository } from '../ports/${MODULE_NAME}.repository';

@Injectable()
export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async findById(id: string): Promise<string> {
    return this.repository.findById(id);
  }
}
EOF

cat > "$BASE_DIR/interface/http/dtos/${MODULE_NAME}.dto.ts" << EOF
export class Create${MODULE_NAME_CAPITAL}Dto {
    // Add your DTO properties here
}

export class Update${MODULE_NAME_CAPITAL}Dto {
    // Add your DTO properties here
}
EOF

cat > "$BASE_DIR/interface/http/dtos/${MODULE_NAME}-response.swagger.ts" << EOF
import { ApiProperty } from '@nestjs/swagger';

export class ${MODULE_NAME_CAPITAL}SwaggerResponseModel {
    @ApiProperty()
    id: string;
    // Add your response properties here
}
EOF

cat > "$BASE_DIR/interface/http/${MODULE_NAME}.controller.ts" << EOF
import { Controller, Get, Param } from '@nestjs/common';
import { ${MODULE_NAME_CAPITAL}Service } from '../../application/services/${MODULE_NAME}.service';

@Controller('${MODULE_NAME}')
export class ${MODULE_NAME_CAPITAL}Controller {
    constructor(private readonly service: ${MODULE_NAME_CAPITAL}Service) {}

    @Get(':id')
    async findById(@Param('id') id: string): Promise<string> {
        return this.service.findById(id);
    }
}
EOF

cat > "$BASE_DIR/${MODULE_NAME}.module.ts" << EOF
import { Module } from '@nestjs/common';
import { ${MODULE_NAME_CAPITAL}Controller } from './interface/http/${MODULE_NAME}.controller';
import { ${MODULE_NAME_CAPITAL}Service } from './application/services/${MODULE_NAME}.service';
import { AuthRepository } from './application/ports/${MODULE_NAME}.repository';

@Module({
    controllers: [${MODULE_NAME_CAPITAL}Controller],
    providers: [${MODULE_NAME_CAPITAL}Service, ${MODULE_NAME_CAPITAL}Repository],
})
export class ${MODULE_NAME_CAPITAL}Module {}
EOF

cat > "$BASE_DIR/interface/http/__test__/${MODULE_NAME}.controller.spec.ts" << EOF
import { Test } from '@nestjs/testing';
import { ${MODULE_NAME_CAPITAL}Controller } from '../interface/http/${MODULE_NAME}.controller';
import { ${MODULE_NAME_CAPITAL}Service } from '../application/services/${MODULE_NAME}.service';

describe('${MODULE_NAME_CAPITAL}Controller', () => {
    let controller: ${MODULE_NAME_CAPITAL}Controller;
    let service: ${MODULE_NAME_CAPITAL}Service;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [${MODULE_NAME_CAPITAL}Controller],
            providers: [
                {
                    provide: ${MODULE_NAME_CAPITAL}Service,
                    useValue: {}
                }
            ],
        }).compile();

        controller = module.get(${MODULE_NAME_CAPITAL}Controller);
        service = module.get(${MODULE_NAME_CAPITAL}Service);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
EOF

cat > "$BASE_DIR/application/services/__test__/${MODULE_NAME}.service.spec.ts" << EOF
import { Test } from '@nestjs/testing';
import { ${MODULE_NAME_CAPITAL}Service } from '../application/services/${MODULE_NAME}.service';
import { ${MODULE_NAME_CAPITAL}Repository } from '../application/ports/${MODULE_NAME}.repository';

describe('${MODULE_NAME_CAPITAL}Service', () => {
    let service: ${MODULE_NAME_CAPITAL}Service;
    let repository: ${MODULE_NAME_CAPITAL}Repository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ${MODULE_NAME_CAPITAL}Service,
                {
                    provide: '${MODULE_NAME_CAPITAL}Repository',
                    useValue: {}
                }
            ],
        }).compile();

        service = module.get(${MODULE_NAME_CAPITAL}Service);
        repository = module.get('${MODULE_NAME_CAPITAL}Repository');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
EOF

echo "Module ${MODULE_NAME} created successfully!"