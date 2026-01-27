from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El usuario debe tener un correo electrónico')

        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('Correo electrónico'), max_length=255, unique=True,)
    first_name = models.CharField(_('Nombre'), max_length=255)
    last_name = models.CharField(_('Apellido'), max_length=255)
    is_active = models.BooleanField(_('Activo'), default=True)
    is_staff = models.BooleanField(_('Staff'), default=False)

    date_joined = models.DateTimeField(_('Fecha de registro'), default=timezone.now)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = 'users'
        verbose_name = _('Usuario')
        verbose_name_plural = _('Usuarios')
        ordering = ['-date_joined']

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return self.email