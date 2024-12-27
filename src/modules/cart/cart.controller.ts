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
import { CartService } from '#modules/cart/services/cart.service';
import { User } from '#shared/decorators/user.decorator';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtRefreshGuard)
  getCartSummary(@User() user: AuthUser) {
    return this.cartService.getCart(user.id);
  }

  @Delete()
  @UseGuards(JwtRefreshGuard)
  clearCart(@User() user: AuthUser) {
    return this.cartService.clearCart(user.id);
  }

  @Post('items')
  @UseGuards(JwtRefreshGuard)
  addItem(@Body() dto: CreateCartItemDto, @User() user: AuthUser) {
    return this.cartService.addToCart(user.id, dto);
  }

  @Patch('items/:itemId')
  @UseGuards(JwtRefreshGuard)
  updateItem(
    @Param('itemId') itemId: number,
    @Body() dto: UpdateCartItemDto,
    @User() user: AuthUser,
  ) {
    return this.cartService.updateCartItem(user.id, itemId, dto);
  }

  @Delete('items/:itemId')
  @UseGuards(JwtRefreshGuard)
  removeItem(@Param('itemId') itemId: number, @User() user: AuthUser) {
    return this.cartService.removeCartItem(user.id, itemId);
  }
}
