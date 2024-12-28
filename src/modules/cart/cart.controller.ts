import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtRefreshGuard } from '#modules/auth/guards/jwt-refresh.guard';
import { AuthUser } from '#modules/auth/interfaces/auth.interface';
import { CreateCartItemDto } from '#modules/cart/dtos/request/create-cart-item.dto';
import { UpdateCartItemDto } from '#modules/cart/dtos/request/update-cart-item.dto';
import { CartResponseDto } from '#modules/cart/dtos/response/cart-response.dto';
import { CartMapper } from '#modules/cart/mappers/cart.mapper';
import { CartService } from '#modules/cart/services/cart.service';
import { User } from '#shared/decorators/user.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtRefreshGuard)
  async getCartSummary(
    @User() user: AuthUser,
  ): Promise<CartResponseDto | null> {
    const cart = await this.cartService.getCart(user.id);

    return cart && CartMapper.toResponse(cart);
  }

  @Delete()
  @UseGuards(JwtRefreshGuard)
  clearCart(@User() user: AuthUser): Promise<void> {
    return this.cartService.clearCart(user.id);
  }

  @Post('items')
  @UseGuards(JwtRefreshGuard)
  async addItem(
    @Body() dto: CreateCartItemDto,
    @User() user: AuthUser,
  ): Promise<CartResponseDto> {
    return CartMapper.toResponse(
      await this.cartService.addToCart(user.id, dto),
    );
  }

  @Patch('items/:itemId')
  @UseGuards(JwtRefreshGuard)
  async updateItem(
    @Param('itemId') itemId: number,
    @Body() dto: UpdateCartItemDto,
    @User() user: AuthUser,
  ): Promise<CartResponseDto> {
    return CartMapper.toResponse(
      await this.cartService.updateCartItem(user.id, itemId, dto),
    );
  }

  @Delete('items/:itemId')
  @UseGuards(JwtRefreshGuard)
  async removeItem(
    @Param('itemId') itemId: number,
    @User() user: AuthUser,
  ): Promise<CartResponseDto | null> {
    const cart = await this.cartService.removeCartItem(user.id, itemId);

    return cart && CartMapper.toResponse(cart);
  }
}
